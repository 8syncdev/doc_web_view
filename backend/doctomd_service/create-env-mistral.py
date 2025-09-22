#!/usr/bin/env python3
"""
Script để tạo file .env mẫu cho DocToMarkdown service với Mistral AI
"""

import os


def create_env_file():
    """Tạo file .env với cấu hình Mistral AI"""

    env_content = """# DocToMarkdown Service Configuration với Mistral AI
# Copy this file to .env and update with your actual values

# Mistral AI Configuration
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-large-latest

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Các model Mistral được hỗ trợ:
# - mistral-large-latest (Mặc định) - Model mạnh nhất
# - mistral-small-latest - Model nhỏ hơn, nhanh hơn  
# - mistral-nemo - Model tối ưu cho tốc độ

# Lấy API key tại: https://console.mistral.ai/
"""

    # Kiểm tra xem file .env đã tồn tại chưa
    if os.path.exists('.env'):
        print("⚠️  File .env đã tồn tại!")
        response = input("Bạn có muốn ghi đè không? (y/N): ")
        if response.lower() != 'y':
            print("❌ Hủy tạo file .env")
            return

    # Tạo file .env
    try:
        with open('.env', 'w', encoding='utf-8') as f:
            f.write(env_content)
        print("✅ Đã tạo file .env thành công!")
        print("📝 Vui lòng chỉnh sửa file .env và thêm Mistral API key thực")
        print("🔑 Đặc biệt quan trọng: Thay 'your_mistral_api_key_here' bằng API key thực")
        print("🌐 Lấy API key tại: https://console.mistral.ai/")
    except Exception as e:
        print(f"❌ Lỗi khi tạo file .env: {e}")


def show_help():
    """Hiển thị hướng dẫn sử dụng"""
    print("""
🚀 DocToMarkdown Service - Mistral AI Environment Setup

Cách sử dụng:
  python create-env-mistral.py          # Tạo file .env mẫu
  python create-env-mistral.py --help  # Hiển thị hướng dẫn này

Sau khi tạo file .env:
  1. Truy cập https://console.mistral.ai/
  2. Đăng ký tài khoản và tạo API key
  3. Mở file .env và thay thế API key mẫu bằng key thực
  4. Chạy service: uvicorn main:app --reload

Test kết nối Mistral API:
  python test-mistral.py

Các model Mistral được hỗ trợ:
  • mistral-large-latest (Mặc định) - Model mạnh nhất
  • mistral-small-latest - Model nhỏ hơn, nhanh hơn
  • mistral-nemo - Model tối ưu cho tốc độ

Để biết thêm chi tiết, xem README.md
""")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] in ['--help', '-h']:
        show_help()
    else:
        create_env_file()
