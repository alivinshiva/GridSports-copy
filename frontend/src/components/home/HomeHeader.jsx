import { Link } from "react-router-dom";

export function HomeHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#f4ede7] dark:border-[#3d2e21]">
            <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fillRule="evenodd"></path>
                            <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fillRule="evenodd"></path>
                        </svg>
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight">Grid Sports</h1>
                </Link>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-xl bg-[#f4ede7] dark:bg-[#3d2e21] text-[#1c140d] dark:text-white transition-colors hover:bg-primary/20">
                        <span className="material-symbols-outlined text-[24px]">notifications</span>
                        <span className="absolute top-2 right-2.5 size-2 bg-primary rounded-full border-2 border-background-light"></span>
                    </button>
                    <Link to="/profile">
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary" data-alt="User profile avatar with orange border" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCc4Y1XBf6f-biRM87-e-Kkw7QScj9DgkT3fN395NkKVPZ-Js9aScP6jVRPNbYbxyFPARUOeRwPCHTiK9Iyp9LP5i1WSaPwzGlpZ_wATUf2RYVhrYrBbBTPVZO--afW_Gy0q-jnBycflAR6fFWBDP4VcKaY7C5BOo7bf84z99q9hGH_ZXMI4hShD-y9v_qvhHVuftJkC4VyFjQ1FlNBSxTJBMciDY-HaLEl79KHOjyqrZb091JFyFgaOVnD333FB9j1nFAuXPlmyZ0')" }}></div>
                    </Link>
                </div>
            </div>
        </header>
    );
}
