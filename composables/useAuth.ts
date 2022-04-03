export const useAuth = () => {
    return useState('auth', () => {
        return {
            ready: false,
            loggedIn: false,
            user: {
                id: 0,
                name: ""
            }
        }
    });
}