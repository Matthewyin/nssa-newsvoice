import sys
import json
import trafilatura
import requests

def main():
    # 设置标准输出编码为 UTF-8，防止中文乱码
    sys.stdout.reconfigure(encoding='utf-8')

    if len(sys.argv) < 2:
        # 输出错误信息到 stderr，但 stdout 输出空 JSON 以保证管道不破裂（取决于调用方处理方式）
        # 或者按照原逻辑输出带 error 的 JSON
        error_msg = {"error": "No URL provided", "status": "failed"}
        print(json.dumps(error_msg, ensure_ascii=False))
        sys.exit(1)

    url = sys.argv[1]

    # Docker/Localhost 兼容性处理
    if 'host.docker.internal' in url:
        url = url.replace('host.docker.internal', '127.0.0.1')

    try:
        # 伪装 User-Agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
        }
        
        # 获取网页内容
        response = requests.get(url, headers=headers, timeout=30)
        
        # 检查响应状态
        if response.status_code != 200:
             print("{}")
             sys.exit(0)
             
        # 设置编码（可选，Trafilatura 通常能处理，但 Requests 有时需要辅助）
        response.encoding = response.apparent_encoding
        downloaded = response.text

        # 提取内容
        result = trafilatura.extract(
            downloaded, 
            output_format='json', 
            with_metadata=True, 
            include_comments=False
        )
        
        if result:
            data = json.loads(result)
            data['status'] = 'success'
            data['original_url'] = url
            print(json.dumps(data, ensure_ascii=False))
        else:
            print("{}")
            
    except Exception as e:
        # 为了调试方便，可以将错误打印到 stderr
        # sys.stderr.write(f"Error processing {url}: {str(e)}\n")
        print("{}")

if __name__ == "__main__":
    main()
