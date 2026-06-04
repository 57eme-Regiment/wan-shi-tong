import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IconMoon, IconSun } from '@tabler/icons-react';
import { buttonVariants } from './components/button.js';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from './components/dropdown-menu.js';
import { useTheme } from './theme-provider.js';
export function ThemeToggle() {
    const { setTheme } = useTheme();
    return (_jsxs(DropdownMenu, { children: [_jsxs(DropdownMenuTrigger, { className: buttonVariants({ variant: 'outline', size: 'icon' }), children: [_jsx(IconSun, { className: "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }), _jsx(IconMoon, { className: "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" }), _jsx("span", { className: "sr-only", children: "Toggle theme" })] }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuItem, { onClick: () => setTheme('light'), children: "Light" }), _jsx(DropdownMenuItem, { onClick: () => setTheme('dark'), children: "Dark" }), _jsx(DropdownMenuItem, { onClick: () => setTheme('system'), children: "System" })] })] }));
}
