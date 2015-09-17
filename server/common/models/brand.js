var slug = require('slug');

module.exports = function (Brand) {

  slug.defaults.mode ='rfc3986';

  Brand.observe('before save', function (ctx, next) {
    if (ctx.isNewInstance && ctx.instance.name) {
      ctx.instance.slug = slug(ctx.instance.name);

      if(ctx.instance.alias === undefined) {
        ctx.instance.alias = [];
        ctx.instance.alias.push(ctx.instance.name);
        ctx.instance.alias.push(ctx.instance.slug);
      }

    }
    next();
  });
};
