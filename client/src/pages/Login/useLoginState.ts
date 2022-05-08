import { useMutation } from '@apollo/client'
import login from 'graphql/mutations/login'
import { LoginInput } from 'graphql/types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface UseLoginStateReturn {
    error: string
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export const useLoginState = (): UseLoginStateReturn => {
    const navigate = useNavigate()
    const [error, setError] = useState('')

    const [loginMutation] = useMutation<{ login: { id: string } | null }, { input: LoginInput }>(login, {
        onCompleted: (response) => {
            console.log(response)
            if (response.login) {
                navigate('/catalogue/?userID=' + response.login.id)
            } else {
                setError('Invalid Login, password invalid.')
            }
        },
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        setError('')
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        loginMutation({
            variables: {
                input: {
                    password: data.get('password') as string,
                    username: data.get('username') as string,
                },
            },
        })
    }

    return {
        error,
        handleSubmit,
    }
}
