
export const errorLogger = (title: string, error: Error) => {
    console.error(
        title,
        new Date(),
        error
    );
}
