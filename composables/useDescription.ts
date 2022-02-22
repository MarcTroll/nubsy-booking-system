export const useDescription = (description: string) => {
    return useMeta({
        meta: [
            {
                name: "description",
                content: description
            },
            {
                name: "og:description",
                content: description
            }
        ]
    });
}