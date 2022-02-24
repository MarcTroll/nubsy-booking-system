export const useBreadcrumb = () => {
    return useState('breadcrumb', () => {
        return {
            paths: []
        }
    })
}