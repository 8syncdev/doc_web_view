#!/usr/bin/env python3
"""
Script để test kết nối Mistral API
"""

import os
import sys
from dotenv import load_dotenv
import openai


def test_mistral_connection():
    """Test kết nối Mistral API"""
    print("🔍 Kiểm tra kết nối Mistral API...")

    # Load .env file
    load_dotenv()

    # Kiểm tra API key
    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key or api_key == "your_mistral_api_key_here":
        print("❌ MISTRAL_API_KEY chưa được cấu hình đúng trong .env")
        print("💡 Lấy API key tại: https://console.mistral.ai/")
        return False

    print("✅ MISTRAL_API_KEY đã được cấu hình")

    # Kiểm tra model
    model = os.getenv("MISTRAL_MODEL", "mistral-large-latest")
    print(f"🎯 Model: {model}")

    try:
        # Khởi tạo client
        client = openai.OpenAI(
            api_key=api_key,
            base_url="https://api.mistral.ai/v1/"
        )

        print("✅ Mistral client đã được khởi tạo")

        # Test API call
        print("🔄 Đang test API call...")
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "user", "content": "Hello! Please respond with 'API test successful'"}
            ],
            max_tokens=50
        )

        result = response.choices[0].message.content
        print(f"✅ API test thành công!")
        print(f"📝 Response: {result}")

        return True

    except Exception as e:
        print(f"❌ Lỗi khi test API: {e}")

        if "401" in str(e):
            print("💡 API key không hợp lệ hoặc hết hạn")
        elif "404" in str(e):
            print("💡 Model không tồn tại hoặc không được hỗ trợ")
        elif "429" in str(e):
            print("💡 Rate limit exceeded - thử lại sau")
        elif "500" in str(e):
            print("💡 Lỗi server Mistral - thử lại sau")

        return False


def main():
    """Main function"""
    print("🚀 DocToMarkdown Service - Mistral API Test\n")

    success = test_mistral_connection()

    if success:
        print("\n🎉 Mistral API hoạt động bình thường!")
        print("🚀 Bạn có thể chạy service: uvicorn main:app --reload")
    else:
        print("\n❌ Mistral API có vấn đề!")
        print("💡 Kiểm tra lại API key và kết nối internet")
        sys.exit(1)


if __name__ == "__main__":
    main()
