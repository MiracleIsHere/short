let db = {
  users: [
    {
      userId: 'dh23ggj5h32g543j5gf43',
      email: 'user@email.com',
      handle: 'user',//
      createdAt: '2019-03-15T10:59:52.798Z'
    }
  ],
  links: [
    {
      linkCode: 'asd',//
      authorHandle: 'user',
      longLink: 'https://user.com',
      shortLink: 'bit.ly/asd',
      private: 'true || false',
      createdAt: '2019-03-15T10:59:52.798Z'
    }
  ],
  subs: [//random
    {
      linkId: 'asd',
      shortLink: 'bit.ly/asd',
      authorHandle: 'user',
      subHandle: 'user',
      type: 'approved || requested || rejected || canceled',
      createdAt: '2019-03-15T10:59:52.798Z'
    }
  ],
  notifications: [//[subId]
    {
      recipient: 'user',
      sender: 'john',
      type: 'approved || requested',
      linkId: 'asd',
      read: 'true || false',
      createdAt: '2019-03-15T10:59:52.798Z'
    }
  ]
};

const userDetails = {
  // Redux data
  credentials: {
    userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
    email: 'user@email.com',
    handle: 'user',
    createdAt: '2019-03-15T10:59:52.798Z'
  },
  links: [
    {
      linkCode: 'asd',
      authorHandle: 'user',
      longLink: 'https://user.com',
      shortLink: 'bit.ly/asd',
      private: 'true || false',
      createdAt: '2019-03-15T10:59:52.798Z'
    },],
  subs: [
    {
      linkId: 'asd',
      shortLink: 'bit.ly/asd',
      authorHandle: 'user',
      subHandle: 'user',
      type: 'approved || requested || rejected || canceled',
      createdAt: '2019-03-15T10:59:52.798Z',
      subId: '[docId]'
    }
  ],
  notifications: [{
    recipient: 'user',
    sender: 'john',
    type: 'approved || requested',
    linkId: 'asd',
    read: 'true || false',
    createdAt: '2019-03-15T10:59:52.798Z',
    subId: '[docId]'
  }]
};