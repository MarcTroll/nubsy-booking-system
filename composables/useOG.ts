export const useOG = (url: string, imageUrl: string, type: string = "website") => {
    return useMeta({
        meta: [
            // TODO: URL and imageUrl must be with booking system host/domain
            {
                name: "og:url",
                content: url
            },
            {
                name: "og:image",
                content: imageUrl
            },
            {
                name: "og:type",
                content: type
            }
        ]
    });
}