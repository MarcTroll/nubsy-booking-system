export const useAuth = () => {
    return useState('auth', () => {
        return {
            loggedIn: false,
            user: {
                id: 0,
                name: ""
            }
        }
    })
}