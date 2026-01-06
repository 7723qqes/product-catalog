export async function onRequest(context) {
  const { env } = context;
  if (!env.GITHUB_CLIENT_ID || env.GITHUB_CLIENT_ID === 'undefined') {
    return new Response(`ERROR: CLIENT_ID MISSING OR UNDEFINED! Current value: ${env.GITHUB_CLIENT_ID || 'null'} - Redeploy needed!`, { status: 500 });
  }
  return new Response(`OK: Client ID loaded successfully: ${env.GITHUB_CLIENT_ID.substring(0,8)}... - Ready for OAuth!`, { status: 200 });
  // 注释掉原代码测试，好了再恢复
}
