const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      return null;
    }

    return ctx.db.query.user({
      where: { id: ctx.request.userId }
    }, info);
  },
  async users(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!')
    }

    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }

    const order = await ctx.db.query.order({
      where: { id: args.id }
    }, info);

    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermission = ctx.request.user.permissions.includes('ADMIN');

    console.log(order.user.id, ctx.request.userId)

    if (!ownsOrder && !hasPermission) {
      throw new Error('You are not allowed to see this ' + order.user.id + ', ' + ctx.request.userId);
    }

    return order;
  },
  async orders(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }

    return ctx.db.query.orders({
      where: { user: { id: ctx.request.userId } }
    }, info);
  },

  // items(parent, args, ctx, info)  {
  //   const items = ctx.db.query.items();

  //   return items;
  // }
};

module.exports = Query;
