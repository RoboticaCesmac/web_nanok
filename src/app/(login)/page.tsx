'use client';
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useUsuarioService } from "../../services/usuario"; // Certifique-se de que o caminho de importação esteja correto
import { useUsuarioContext } from "../../context/usuario-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const usuarioSrv = useUsuarioService(); // Aqui chamamos o hook corretamente
    const { setUsuario } = useUsuarioContext(); // Contexto para armazenar o usuário logado
    const router = useRouter();
    const [erro, setErro] = useState<boolean>(false); // Controle de erro de login

    const onSubmit = async ({ email, senha }: any) => {
        console.log('Tentando logar com:', email, senha); // Verificando se o login é chamado corretamente
        try {
            // Chamando o serviço de login para autenticar o usuário
            const { sucesso, usuario } = await usuarioSrv.logar(email, senha);

            console.log('Resultado do login:', sucesso, usuario); // Verificando o resultado do login

            if (sucesso) {
                setErro(false); // Reseta o erro se o login for bem-sucedido
                setUsuario(usuario); // Armazena o usuário no contexto
                router.push('/admin/conteudo/cursos'); // Redireciona para a página correta
            } else {
                setErro(true); // Se o login falhar, exibe o erro
            }
        } catch (error) {
            console.error('Erro ao tentar logar:', error); // Verificando se algum erro ocorre
            setErro(true); // Marca que houve erro
        }
    }

    return (
        <>
            <div className="page-header min-vh-100">
                <div className="container">
                    <div className="row">
                        <div className="mx-auto">
                            <Formik
                                initialValues={{ email: '', senha: '' }}
                                onSubmit={onSubmit}
                            >
                                {() => (
                                    <div className="card card-plain">
                                        <div className="card-header pb-0 text-start">
                                            <h4 className="font-weight-bolder">Login</h4>
                                            <p className="mb-0">Informe seu email e senha</p>
                                        </div>
                                        <div className="card-body">
                                            <Form>
                                                <div className="mb-3">
                                                    <Field type="email" name="email" className="form-control form-control-lg" placeholder="Email" required />
                                                </div>
                                                <div className="mb-3">
                                                    <Field type="password" name="senha" className="form-control form-control-lg" placeholder="Senha" required />
                                                </div>
                                                {erro && <p className="alert alert-danger">Login ou senha incorreta!</p>} {/* Exibe a mensagem de erro se houver falha */}
                                                <div className="text-center">
                                                    <button type="submit" className="btn btn-lg btn-primary btn-lg w-100 mt-4 mb-0">Logar</button>
                                                </div>
                                            </Form>
                                        </div>
                                        <div className="card-footer text-center pt-0 px-lg-2 px-1">
                                            <p className="mb-4 text-sm mx-auto">
                                                Perdeu sua senha? 
                                                <Link href="/recuperar-senha" className="text-primary text-gradient font-weight-bold">Recuperar Senha</Link>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
