'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import { useContext, useEffect } from "react";
import { useUsuarioContext } from "../../context/usuario-context";

export default function AdminLayout({children}: any) {

    const router = useRouter();
    const { usuario, carregado, deslogar } = useUsuarioContext();
    const url = usePathname();
    // ==============================================================

    const handleSair = () => {
        deslogar();
        router.replace('/')
    }

    // --------------
    useEffect(() => {
        if (carregado && !usuario) 
            router.replace('/')
    }, [carregado])
    // ===============================================================

    return (
        <>
            {carregado && usuario && (
                <main className="main-content position-relative border-radius-lg bg-primary" style={{ minHeight: '100vh' }}>
                    <div className="h-100 bg-primary position-absolute w-100"></div>

                    {/* MENU */}
                    <aside className="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-4 offcanvas-lg" id="sidenav-main">
                        <div className="sidenav-header">
                            <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
                            <p className="navbar-brand m-0">
                                <span className="ms-1 font-weight-bold">NanoK Gerenciador</span>
                            </p>
                        </div>
                        <hr className="horizontal dark mt-0" />
                        <div className="collapse navbar-collapse w-auto " id="sidenav-collapse-main">
                            <ul className="navbar-nav">
                                {/* CURSOS */}
                                <li className="nav-item">
                                    <Link className={'nav-link ' + (url.includes('conteudo/cursos') ? 'active' : '')} href="/admin/conteudo/cursos">
                                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="ni ni-tv-2 text-primary text-sm opacity-10"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Cursos</span>
                                    </Link>
                                </li>

                                {/* Unidades */}
                                <li className="nav-item">
                                    <Link className={'nav-link ' + (url.includes('conteudo/unidades') ? 'active' : '')} href={'/admin/conteudo/unidades'}>
                                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="ni ni-bullet-list-67 text-warning text-sm opacity-10"></i>
                                        </div>
                                        <span className="nav-link-text ms-1">Unidades</span>
                                    </Link>
                                </li>
                                {/* Criar curso */}
                                <li className="nav-item">
                                    <Link className={'nav-link ' + (url.endsWith('criarCurso') ? 'active' : '')} href="/admin/criarCurso">
                                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="material-icons text-warning text-sm opacity-10">+</i>
                                        </div>
                                        <span className="nav-link-text ms-1">Criar curso</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={'nav-link ' + (url.endsWith('criarUnidade') ? 'active' : '')} href="/admin/criarUnidade">
                                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="material-icons text-warning text-sm opacity-10">+</i>
                                        </div>
                                        <span className="nav-link-text ms-1">Criar unidade</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className={'nav-link ' + (url.endsWith('criarLicao') ? 'active' : '')} href="/admin/criarLicao">
                                        <div className="icon icon-shape icon-sm border-radius-md text-center me-2 d-flex align-items-center justify-content-center">
                                            <i className="material-icons text-warning text-sm opacity-10">+</i>
                                        </div>
                                        <span className="nav-link-text ms-1">Criar lição</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* SAIR */}
                        <div className="sidenav-footer mx-3 ">
                            <p className="btn btn-primary btn-sm mb-0 w-100" onClick={handleSair}>Deslogar</p>
                        </div>
                    </aside>

                    {/* FIM MENU */}
                    <main className="main-content position-relative border-radius-lg bg-primary">
                        {/* HEADER */}
                        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl " id="navbarBlur" data-scroll="false">
                            <div className="container-fluid py-1 px-3 justify-content-end">
                                <p className="nav-link text-white font-weight-bold text-right">
                                    Bem vindo, {usuario.nome} 
                                    <i className="fa fa-user me-sm-1"></i>
                                    <span className="d-sm-inline" onClick={handleSair}>(Deslogar)</span>
                                </p>
                            </div>
                        </nav>
                        {/* FIM HEADER */}

                        <div className="container-fluid">
                            <div className="container-fluid py-4 card">
                                {children}  
                            </div>
                        </div>

                        <footer className="footer pt-3 bg-primary">
                            <div className="container-fluid">
                                <div className="row align-items-center justify-content-lg-between">
                                    <div className="col-lg-6 mb-lg-0 mb-4">
                                        <p className="copyright text-center text-white text-sm text-lg-start">
                                            Gerenciador de conteúdo NanoK
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </main>
                </main>
            )}
        </>
    );
}
