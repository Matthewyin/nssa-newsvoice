import sys
import json
import trafilatura

def main():
    # 设置标准输出编码为 UTF-8，防止中文乱码
    sys.stdout.reconfigure(encoding='utf-8')

    if len(sys.argv) < 2:
        error_msg = {"error": "No URL provided", "status": "failed"}
        print(json.dumps(error_msg, ensure_ascii=False))
        sys.exit(1)

    url = sys.argv[1]

    # 当脚本在宿主机运行（通过SSH调用），但传入的是Docker内部使用的 'host.docker.internal' 域名时，
    # 需要将其替换为 'localhost' 或 '127.0.0.1' 才能在宿主机上正确访问。
    if 'host.docker.internal' in url:
        url = url.replace('host.docker.internal', '127.0.0.1')

    try:
    # 下载网页内容
        # 使用 requests 替代 trafilatura.fetch_url 以便更好地控制 Headers
        import requests
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/'
        }
        
        response = requests.get(url, headers=headers, timeout=30)
        
        # 检查响应状态
        if response.status_code != 200:
             # 返回空对象而不是错误信息，方便后续流程过滤
             print("{}")
             sys.exit(0)
             
        downloaded = response.text

        # 提取内容
        # include_images=False, include_comments=False 专注于正文
        # with_metadata=True 会提取标题、日期、作者等
        result = trafilatura.extract(
            downloaded, 
            output_format='json', 
            with_metadata=True, 
            include_comments=False
        )
        
        if result:
            # result 本身已经是 JSON 字符串，可以直接打印
            # 但为了确保结构统一，我们解析后再封装一次，或者直接从 JSON 中加载
            data = json.loads(result)
            data['status'] = 'success'
            data['original_url'] = url
            print(json.dumps(data, ensure_ascii=False))
        else:
            # 提取失败，返回空对象
            print("{}")
            
    except Exception:
        # 发生异常，返回空对象
        print("{}")

if __name__ == "__main__":
    main()
