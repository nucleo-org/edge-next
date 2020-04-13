import { useState } from 'react'
import Router from 'next/router'
import { useUser } from '../lib/hooks'
import Layout from '../components/layout/normal/layout'
import Form from '../components/form'
import fetch from '../lib/fetcher'

const Login = () => {
  useUser({ redirectTo: '/', redirectIfFound: true })

  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    event.preventDefault()

    if (errorMsg) setErrorMsg('')

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then(() => {
          Router.push('/')
        })
        .catch((err) => {
          throw new Error(err)
        })
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(error.message)
    }
  }

  return (
    <Layout title="login">
      <div className="login">
        <Form isLogin errorMessage={errorMsg} onSubmit={handleSubmit} />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  )
}

export default Login
