import os
import tempfile
import aiofiles
import time
import asyncio
from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from doctomarkdown import DocToMarkdown
import openai

# Load environment variables
load_dotenv()

app = FastAPI(
    title="DocToMarkdown API",
    description="API để chuyển đổi tài liệu sang Markdown",
    version="1.0.0"
)

# CORS middleware để frontend có thể gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models


class ConversionRequest(BaseModel):
    extract_images: bool = True
    extract_tables: bool = True
    output_type: str = "markdown"  # "markdown" or "text"


class ConversionResponse(BaseModel):
    success: bool
    message: str
    pages: List[dict]
    total_pages: int
    file_type: str


class ErrorResponse(BaseModel):
    success: bool
    message: str
    error: str

# Initialize LLM client


def get_llm_client():
    """Khởi tạo LLM client dựa trên cấu hình"""
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        print("⚠️  MISTRAL_API_KEY không được tìm thấy trong .env")
        return None

    client = openai.OpenAI(
        api_key=api_key,
        base_url="https://api.mistral.ai/v1/",
        timeout=15.0  # 15 second timeout
    )
    return client


def get_llm_model():
    """Lấy tên model từ .env"""
    return os.getenv("MISTRAL_MODEL", "magistral-small-2509")


async def retry_llm_call(func, max_retries=2, base_delay=0.5):
    """Retry logic cho LLM calls với exponential backoff"""
    print(f"🔄 Starting LLM call (max retries: {max_retries})")

    for attempt in range(max_retries):
        try:
            print(f"📞 Attempting LLM call {attempt + 1}/{max_retries}")
            result = await func()
            print(f"✅ LLM call successful on attempt {attempt + 1}")
            return result
        except Exception as e:
            error_str = str(e)
            print(f"❌ LLM call failed on attempt {attempt + 1}: {error_str}")

            if "429" in error_str or "rate_limited" in error_str.lower():
                if attempt < max_retries - 1:
                    delay = base_delay * (2 ** attempt)  # Exponential backoff
                    print(
                        f"⚠️  Rate limit hit, retrying in {delay}s... (attempt {attempt + 1}/{max_retries})")
                    await asyncio.sleep(delay)
                    continue
                else:
                    print(
                        f"❌ Rate limit exceeded after {max_retries} attempts")
                    raise HTTPException(
                        status_code=429,
                        detail="API rate limit exceeded. Please try again later."
                    )
            else:
                # Non-rate-limit error, don't retry
                print(f"❌ Non-rate-limit error, not retrying: {error_str}")
                raise e

    raise HTTPException(
        status_code=500,
        detail="Failed to process request after multiple attempts"
    )


# Global LLM client và model
llm_client = get_llm_client()
llm_model = get_llm_model()


@app.get("/")
async def root():
    return {"message": "DocToMarkdown API đang hoạt động!"}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "llm_available": llm_client is not None,
        "llm_provider": "mistral",
        "llm_model": llm_model if llm_client else None
    }


@app.post("/convert", response_model=ConversionResponse)
async def convert_document(
    file: UploadFile = File(...),
    extract_images: bool = Form(True),
    extract_tables: bool = Form(True),
    output_type: str = Form("markdown")
):
    """
    Chuyển đổi tài liệu sang Markdown
    Hỗ trợ: PDF, DOCX, PPTX, CSV, Images (PNG, JPG, JPEG)
    """
    print(f"🔥 BACKEND: /convert endpoint called!")
    print(f"📄 Received file: {file.filename} ({file.size} bytes)")
    print(
        f"⚙️  Options: extract_images={extract_images}, extract_tables={extract_tables}, output_type={output_type}")

    try:
        # Kiểm tra file type
        file_extension = file.filename.split(
            '.')[-1].lower() if file.filename else ""
        supported_types = ['pdf', 'docx', 'pptx', 'csv', 'png', 'jpg', 'jpeg']

        if file_extension not in supported_types:
            raise HTTPException(
                status_code=400,
                detail=f"Loại file không được hỗ trợ. Hỗ trợ: {', '.join(supported_types)}"
            )

        # Tạo file tạm thời
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_extension}") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            print(f"🔧 Initializing DocToMarkdown converter...")
            print(f"🤖 LLM available: {llm_client is not None}")

            # Khởi tạo DocToMarkdown
            app_converter = DocToMarkdown(
                llm_client=llm_client,
                llm_model=llm_model if llm_client else None
            )

            # Chọn function conversion dựa trên file type
            conversion_function = {
                'pdf': app_converter.convert_pdf_to_markdown,
                'docx': app_converter.convert_docx_to_markdown,
                'pptx': app_converter.convert_pptx_to_markdown,
                'csv': app_converter.convert_csv_to_markdown,
                'png': app_converter.convert_image_to_markdown,
                'jpg': app_converter.convert_image_to_markdown,
                'jpeg': app_converter.convert_image_to_markdown,
            }[file_extension]

            print(f"🚀 Starting conversion for {file_extension} file...")

            # Thực hiện conversion với retry logic
            async def perform_conversion():
                print(f"📝 Calling conversion function for {file_extension}...")
                return conversion_function(
                    filepath=temp_file_path,
                    extract_images=extract_images,
                    extract_tables=extract_tables,
                    output_type=output_type
                )

            result = await retry_llm_call(perform_conversion)
            print(f"✅ Conversion completed successfully!")

            # Chuẩn bị response
            pages_data = []
            for page in result.pages:
                pages_data.append({
                    "page_number": page.page_number,
                    "content": page.page_content,
                    "content_length": len(page.page_content)
                })

            return ConversionResponse(
                success=True,
                message=f"Chuyển đổi thành công {file.filename}",
                pages=pages_data,
                total_pages=len(pages_data),
                file_type=file_extension
            )

        finally:
            # Xóa file tạm thời
            os.unlink(temp_file_path)

    except HTTPException:
        # Re-raise HTTP exceptions (like rate limit)
        raise
    except Exception as e:
        error_msg = str(e)

        # Handle specific errors
        if "tesseract" in error_msg.lower():
            raise HTTPException(
                status_code=500,
                detail="OCR service không khả dụng. Vui lòng cài đặt Tesseract OCR hoặc thử với file khác."
            )
        elif "429" in error_msg or "rate_limited" in error_msg.lower():
            raise HTTPException(
                status_code=429,
                detail="API rate limit exceeded. Vui lòng thử lại sau."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Lỗi khi chuyển đổi: {error_msg}"
            )


@app.post("/convert-url", response_model=ConversionResponse)
async def convert_url(
    url: str = Form(...),
    extract_images: bool = Form(True),
    extract_tables: bool = Form(True),
    output_type: str = Form("markdown")
):
    """
    Chuyển đổi URL sang Markdown
    """
    try:
        # Khởi tạo DocToMarkdown
        app_converter = DocToMarkdown(
            llm_client=llm_client,
            llm_model=llm_model if llm_client else None
        )

        # Thực hiện conversion với retry logic
        async def perform_url_conversion():
            return app_converter.convert_url_to_markdown(
                urlpath=url,
                extract_images=extract_images,
                extract_tables=extract_tables,
                output_type=output_type
            )

        result = await retry_llm_call(perform_url_conversion)

        # Chuẩn bị response
        pages_data = []
        for page in result.pages:
            pages_data.append({
                "page_number": page.page_number,
                "content": page.page_content,
                "content_length": len(page.page_content)
            })

        return ConversionResponse(
            success=True,
            message=f"Chuyển đổi URL thành công: {url}",
            pages=pages_data,
            total_pages=len(pages_data),
            file_type="url"
        )

    except HTTPException:
        # Re-raise HTTP exceptions (like rate limit)
        raise
    except Exception as e:
        error_msg = str(e)

        # Handle specific errors
        if "429" in error_msg or "rate_limited" in error_msg.lower():
            raise HTTPException(
                status_code=429,
                detail="API rate limit exceeded. Vui lòng thử lại sau."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Lỗi khi chuyển đổi URL: {error_msg}"
            )


@app.get("/supported-formats")
async def get_supported_formats():
    """Lấy danh sách các định dạng file được hỗ trợ"""
    return {
        "supported_formats": {
            "pdf": "PDF documents",
            "docx": "Microsoft Word documents",
            "pptx": "Microsoft PowerPoint presentations",
            "csv": "Comma-separated values files",
            "png": "PNG images",
            "jpg": "JPEG images",
            "jpeg": "JPEG images"
        },
        "url_support": True,
        "llm_available": llm_client is not None,
        "llm_provider": "mistral",
        "llm_model": llm_model if llm_client else None
    }


@app.post("/convert-fast", response_model=ConversionResponse)
async def convert_document_fast(
    file: UploadFile = File(...),
    extract_images: bool = Form(False),
    extract_tables: bool = Form(False),
    output_type: str = Form("markdown")
):
    """
    Chuyển đổi tài liệu sang Markdown (không sử dụng LLM - nhanh hơn)
    Chỉ hỗ trợ: CSV, và các file đơn giản
    """
    print(f"⚡ FAST MODE: Received file: {file.filename} ({file.size} bytes)")

    try:
        # Kiểm tra file type
        file_extension = file.filename.split(
            '.')[-1].lower() if file.filename else ""
        fast_supported_types = ['csv', 'txt']  # Chỉ hỗ trợ file đơn giản

        if file_extension not in fast_supported_types:
            raise HTTPException(
                status_code=400,
                detail=f"Fast mode chỉ hỗ trợ: {', '.join(fast_supported_types)}. Sử dụng /convert cho file phức tạp."
            )

        # Tạo file tạm thời
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_extension}") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        try:
            print(f"⚡ FAST MODE: Converting {file_extension} without LLM...")

            # Khởi tạo DocToMarkdown KHÔNG có LLM
            app_converter = DocToMarkdown(
                llm_client=None,  # Không sử dụng LLM
                llm_model=None
            )

            # Chỉ hỗ trợ CSV cho fast mode
            if file_extension == 'csv':
                result = app_converter.convert_csv_to_markdown(
                    filepath=temp_file_path,
                    extract_images=False,  # Không extract images trong fast mode
                    extract_tables=False,  # Không extract tables trong fast mode
                    output_type=output_type
                )
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Fast mode không hỗ trợ file {file_extension}"
                )

            print(f"⚡ FAST MODE: Conversion completed!")

            # Chuẩn bị response
            pages_data = []
            for page in result.pages:
                pages_data.append({
                    "page_number": page.page_number,
                    "content": page.page_content,
                    "content_length": len(page.page_content)
                })

            return ConversionResponse(
                success=True,
                message=f"Chuyển đổi nhanh thành công {file.filename}",
                pages=pages_data,
                total_pages=len(pages_data),
                file_type=file_extension
            )

        finally:
            # Xóa file tạm thời
            os.unlink(temp_file_path)

    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Fast conversion error: {error_msg}")
        raise HTTPException(
            status_code=500,
            detail=f"Lỗi khi chuyển đổi nhanh: {error_msg}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        reload=os.getenv("DEBUG", "True").lower() == "true"
    )
