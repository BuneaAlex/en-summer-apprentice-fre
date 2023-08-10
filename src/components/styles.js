const bookOfStyles = {
    disabled_button: ['bg-gray-500', 'rounded-lg', 'p-2', 'm-22', 'mx-auto', 'block', 'text-white', 'flex', 'flex-wrap', 'items-center'],
    standard_button: ['bg-orange-500', 'rounded-lg', 'p-2', 'm-22', 'mx-auto', 'block', 'text-white', 'flex', 'flex-wrap', 'items-center']

}

export function useStyles(type)
{
    if(typeof type === 'string')
        return bookOfStyles[type];
    else
    {
        const allStyles = type.map((t) => bookOfStyles[t]);
        return allStyles.flat();
    }
}
