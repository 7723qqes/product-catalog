export async function onRequest({ request }) {
  const url = new URL(request.url);

  // 获取 URL 参数
  const category = url.searchParams.get('category'); // 分类
  const page = parseInt(url.searchParams.get('page') || '1'); // 页码
  const pageSize = 10; // 每页显示数量

  // 读取 products.json
  const res = await fetch('https://你的域名/products.json', {
    cf: { cacheTtl: 300 } // CDN 缓存 5 分钟
  });

  let products = await res.json();

  // 分类筛选
  if (category) {
    products = products.filter(p => p.category === category);
  }

  // 分页
  const start = (page - 1) * pageSize;
  const list = products.slice(start, start + pageSize);

  return new Response(JSON.stringify({
    page,
    total: products.length,
    list
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
