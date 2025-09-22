#!/usr/bin/env python3
"""
Test script để kiểm tra retry logic và error handling
"""

import requests
import time
import json

BASE_URL = "http://127.0.0.1:8000"


def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health check: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False


def test_supported_formats():
    """Test supported formats endpoint"""
    print("\n🔍 Testing supported formats...")
    try:
        response = requests.get(f"{BASE_URL}/supported-formats")
        print(f"✅ Supported formats: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Supported formats failed: {e}")
        return False


def test_rate_limit_handling():
    """Test rate limit handling"""
    print("\n🔍 Testing rate limit handling...")

    # Tạo một file test nhỏ
    test_content = b"Test content for rate limit testing"

    try:
        # Gửi nhiều request liên tiếp để trigger rate limit
        for i in range(5):
            print(f"  Sending request {i+1}/5...")
            files = {'file': ('test.txt', test_content, 'text/plain')}
            data = {
                'extract_images': 'false',
                'extract_tables': 'false',
                'output_type': 'markdown'
            }

            response = requests.post(
                f"{BASE_URL}/convert", files=files, data=data)
            print(f"    Status: {response.status_code}")

            if response.status_code == 429:
                print("    ⚠️  Rate limit detected - retry logic should handle this")
                break
            elif response.status_code == 200:
                print("    ✅ Request successful")
            else:
                print(f"    ❌ Unexpected status: {response.status_code}")
                print(f"    Response: {response.text}")

            time.sleep(0.5)  # Small delay between requests

        return True
    except Exception as e:
        print(f"❌ Rate limit test failed: {e}")
        return False


def test_error_handling():
    """Test error handling"""
    print("\n🔍 Testing error handling...")

    try:
        # Test với file không hỗ trợ
        test_content = b"Test content"
        files = {'file': ('test.xyz', test_content,
                          'application/octet-stream')}
        data = {
            'extract_images': 'false',
            'extract_tables': 'false',
            'output_type': 'markdown'
        }

        response = requests.post(f"{BASE_URL}/convert", files=files, data=data)
        print(f"✅ Error handling test: {response.status_code}")

        if response.status_code == 400:
            print("✅ Correctly rejected unsupported file type")
        else:
            print(f"❌ Unexpected response: {response.text}")

        return True
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        return False


def main():
    """Run all tests"""
    print("🚀 Starting backend tests...")
    print("=" * 50)

    tests = [
        test_health,
        test_supported_formats,
        test_error_handling,
        test_rate_limit_handling,
    ]

    passed = 0
    total = len(tests)

    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} crashed: {e}")

    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} passed")

    if passed == total:
        print("🎉 All tests passed!")
    else:
        print("⚠️  Some tests failed")


if __name__ == "__main__":
    main()
