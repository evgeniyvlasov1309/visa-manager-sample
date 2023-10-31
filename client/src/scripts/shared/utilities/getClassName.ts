export function getClassName(
    classNames: (string | undefined)[],
    divider = " "
) {
    return classNames
        .filter((className) => className)
        .join(divider)
        .trim();
}
