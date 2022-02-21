export const useAuth = () => {
    return useState('auth', () => {
        return {
            loggedIn: false,
            username: "Albrecht Dürer"
        }
    })
}