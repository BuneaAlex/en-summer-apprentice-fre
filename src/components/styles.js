const bookOfStyles = {
    disabled_button: ['bg-gray-500', 'rounded-lg', 'p-2', 'm-22', 'mx-auto', 'block', 'text-white', 'flex', 'flex-wrap', 'items-center','hover:bg-gray-600'],
    standard_button: ['bg-orange-500', 'rounded-lg', 'p-2', 'm-22', 'mx-auto', 'block', 'text-white', 'flex', 'flex-wrap', 'items-center','hover:bg-orange-600'],
    standard_form: ['bg-gray-200','rounded-lg','space-y-4','p-6'],
    flex_center_container: ['flex','items-center', 'justify-center', 'flex-wrap']
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
