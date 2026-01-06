export async function onRequest(context) {
  const { env } = context;
  if (!env.GITHUB_CLIENT_ID || env.GITHUB_CLIENT_ID === 'undefined') {
    return new Response(`ERROR: CLIENT_ID MISSING OR UNDEFINED! Current value: ${env.GITHUB_CLIENT_ID || 'null'} - Redeploy needed!`, { status: 500 });
  }
  return new Response(`OK: Client ID loaded successfully: ${env.GITHUB_CLIENT_ID.substring(0,8)}... - Ready for OAuth!`, { status: 200 });
  // 注释掉原代码测试，好了再恢复
}
export async function onRequest(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const client_id = env.GITHUB_CLIENT_ID;

    try {
        const url = new URL(request.url);
        const redirectUrl = new URL('https://github.com/login/oauth/authorize');
        redirectUrl.searchParams.set('client_id', client_id);
        redirectUrl.searchParams.set('redirect_uri', url.origin + '/api/callback');
        redirectUrl.searchParams.set('scope', 'repo user');
        redirectUrl.searchParams.set(
            'state',
            crypto.getRandomValues(new Uint8Array(12)).join(''),
        );
        return Response.redirect(redirectUrl.href, 301);

    } catch (error) {
        console.error(error);
        return new Response(error.message, {
            status: 500,
        });
    }
}
