#!/usr/bin/env python3
"""
Test script để kiểm tra fast mode endpoint
"""

import requests
import time

BASE_URL = "http://127.0.0.1:8000"


def test_fast_mode():
    """Test fast mode endpoint"""
    print("⚡ Testing fast mode endpoint...")

    try:
        # Tạo file CSV test
        csv_content = """Name,Age,City,Country
John Doe,25,New York,USA
Jane Smith,30,London,UK
Bob Johnson,35,Tokyo,Japan
Alice Brown,28,Paris,France
Charlie Wilson,32,Sydney,Australia"""

        # Test fast mode
        files = {'file': ('test.csv', csv_content, 'text/csv')}
        data = {
            'extract_images': 'false',
            'extract_tables': 'false',
            'output_type': 'markdown'
        }

        print("📤 Sending request to /convert-fast...")
        start_time = time.time()

        response = requests.post(
            f"{BASE_URL}/convert-fast", files=files, data=data)

        end_time = time.time()
        duration = end_time - start_time

        print(f"⏱️  Response time: {duration:.2f} seconds")
        print(f"📊 Status code: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ Fast mode successful!")
            print(f"📄 Pages: {result['total_pages']}")
            print(
                f"📝 Content preview: {result['pages'][0]['content'][:200]}...")
        else:
            print(f"❌ Fast mode failed: {response.text}")

        return duration < 5.0  # Should be fast (< 5 seconds)

    except Exception as e:
        print(f"❌ Fast mode test failed: {e}")
        return False


def test_normal_mode():
    """Test normal mode endpoint for comparison"""
    print("\n🐌 Testing normal mode endpoint...")

    try:
        # Tạo file CSV test
        csv_content = """Name,Age,City,Country
John Doe,25,New York,USA
Jane Smith,30,London,UK"""

        # Test normal mode
        files = {'file': ('test.csv', csv_content, 'text/csv')}
        data = {
            'extract_images': 'false',
            'extract_tables': 'false',
            'output_type': 'markdown'
        }

        print("📤 Sending request to /convert...")
        start_time = time.time()

        response = requests.post(f"{BASE_URL}/convert", files=files, data=data)

        end_time = time.time()
        duration = end_time - start_time

        print(f"⏱️  Response time: {duration:.2f} seconds")
        print(f"📊 Status code: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print("✅ Normal mode successful!")
            print(f"📄 Pages: {result['total_pages']}")
        else:
            print(f"❌ Normal mode failed: {response.text}")

        return True

    except Exception as e:
        print(f"❌ Normal mode test failed: {e}")
        return False


def main():
    """Run tests"""
    print("🚀 Starting performance tests...")
    print("=" * 50)

    # Test fast mode
    fast_success = test_fast_mode()

    # Test normal mode
    normal_success = test_normal_mode()

    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"⚡ Fast mode: {'✅ PASS' if fast_success else '❌ FAIL'}")
    print(f"🐌 Normal mode: {'✅ PASS' if normal_success else '❌ FAIL'}")

    if fast_success and normal_success:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed")


if __name__ == "__main__":
    main()
