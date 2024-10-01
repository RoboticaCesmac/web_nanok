// src/app/admin/cursos/editar/[[...id]]/page.tsx
"use client";

import * as React from 'react';
import { AdminHeader } from '@/app/admin/components';
import CursoService from '@/services/curso';
import { Field, Form, Formik } from 'formik';

export default function CursoEditarPage({ params }: any) {
    const [curso, setCurso] = React.useState<any>(null);
    
    // Função para salvar o curso (editar ou cadastrar)
    const handleSalvar = async (curso: any) => {
        if (params?.id) {
            await CursoService.editarCurso(params.id[0], curso.nomeCurso, curso.resumo);
        } else {
            alert('Error: ID não encontrado.');
        }
    };

    // Função para buscar o curso pelo ID
    const buscarCurso = async (id: string) => {
        const { sucesso, curso } = await CursoService.detalharCurso(id); // Use detalharCurso aqui
        if (sucesso) setCurso(curso);
        else alert("Curso não encontrado."); // Alert para o caso de erro
    };

    React.useEffect(() => {
        if (params?.id) {
            buscarCurso(params.id[0]); // Verifique se params.id[0] realmente existe
        }
    }, [params]);

    return (
        <main>
            <AdminHeader titulo={curso ? 'Editar Curso' : 'Cadastrar Curso'} />
            <h6>Formulário</h6>    

            <Formik
                initialValues={curso || { nomeCurso: '', resumo: '' }} // Inicializa com valores vazios se curso for null
                enableReinitialize
                onSubmit={handleSalvar}
            >
                {() => (
                    <Form>
                        <div className="card-body">  
                            {/* NOME DO CURSO */}
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="form-control-label">Nome do Curso</label>
                                        <Field className="form-control" type="text" name="nomeCurso" />
                                    </div>
                                </div>

                                {/* RESUMO */}
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="form-control-label">Resumo</label>
                                        <Field as="textarea" className="form-control" name="resumo" />
                                    </div>
                                </div>

                                {/* BOTÃO */}
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <button className='btn btn-primary w-100' type="submit">Salvar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </main>
    );
}
