export const useTitle = (title: string) => {
    return useMeta({
        title: title + " - nubsy",
        meta: [
            {
                name: "og:title",
                content: title + " - nubsy"
            }
        ]
    });
}