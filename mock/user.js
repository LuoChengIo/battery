
const tokens = {
  admin123: {
    token: 'admin-token',
    companyLogoUrl: 'companyLogoUrl',
    functionlist: ['admin']
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/user/userManage/login',
    type: 'post',
    response: config => {
      const { loginId } = config.body
      const token = tokens[loginId]
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }
      return {
        code: 20000,
        data: token
      }
    }
  },
  {
    url: '/userManage/getEncKey',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          signKey: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFVNJNtvQ7pO6XueD1gy5x0A1npl5sDpp8n7LNueaX53xlds8yEaE+lkdA9C/zwPDeWOz9kyNAoQB9MTcVcWtM5mOlywtCWcEXmlv/8c6o7dy2/Mu5d3G0oFlpBLhulqmYuGPgYz6h3z72Pzesh3C19EjPJVafKZm9X1wv/Sdo+wIDAQAB`
        }
      }
    }
  },
  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
