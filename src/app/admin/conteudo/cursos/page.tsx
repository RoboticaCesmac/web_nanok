'use client';

import React, { useEffect, useState } from "react";
import CursoService from "@/services/curso";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../../components";
import Link from "next/link";

interface Curso {
    id: string;
    nomeCurso: string;
    resumo: string;
}

export default function Cursos() {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [editandoCursoId, setEditandoCursoId] = useState<string | null>(null);
    const [nomeCurso, setNomeCurso] = useState("");
    const [resumo, setResumo] = useState("");
    const router = useRouter();

    // Busca os cursos ao carregar a página
    useEffect(() => {
        const buscarCursos = async () => {
            const { sucesso, cursos } = await CursoService.buscarCursos();
            if (sucesso) {
                setCursos(cursos);
            } else {
                alert("Erro ao buscar cursos.");
            }
        };
        buscarCursos();
    }, []);

    const handleDeletarCurso = async (id: string) => {
        const { sucesso } = await CursoService.deletarCurso(id);
        if (sucesso) {
            setCursos(cursos.filter(curso => curso.id !== id));
            alert("Curso deletado com sucesso.");
        } else {
            alert("Erro ao deletar curso.");
        }
    };

    const handleEditarCurso = async () => {
        if (editandoCursoId) {
            const { sucesso } = await CursoService.editarCurso(editandoCursoId, nomeCurso, resumo);
            if (sucesso) {
                setCursos(cursos.map(curso => curso.id === editandoCursoId ? { id: curso.id, nomeCurso, resumo } : curso));
                alert("Curso editado com sucesso.");
                setEditandoCursoId(null);
                setNomeCurso("");
                setResumo("");
            } else {
                alert("Erro ao editar curso.");
            }
        }
    };

    return (
        <main>
            <AdminHeader titulo='Lista de Cursos'>
                <Link className='btn btn-primary' href="/admin/criarCurso">Novo Curso</Link>
            </AdminHeader>

            <div className="card-header pb-0">
                <h6>Cursos</h6>
            </div>
            <div className="card-body px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                    <table className="table align-items-center mb-0">
                        <thead>
                            <tr>
                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Curso</th>
                                <th className="text-secondary opacity-7">Resumo</th>
                                <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cursos.map((curso) => (
                                <tr key={curso.id}>
                                    <td>
                                        <div className="d-flex px-2 py-1">
                                            <div className="d-flex flex-column justify-content-center">
                                                <h6 className="mb-0 text-sm">{curso.nomeCurso}</h6>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <p className="text-xs text-secondary mb-0">{curso.resumo}</p>
                                    </td>
                                    <td className="align-middle text-center text-sm">
                                        <Link href={`/admin/cursos/editar/${curso.id}`} className="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Editar curso">
                                            Editar
                                        </Link>
                                        <span className="mx-2">|</span> {/* Adicionando espaço entre os links */}
                                        <Link 
                                            href="#" 
                                            className="text-danger font-weight-bold text-xs" 
                                            data-toggle="tooltip" 
                                            data-original-title="Deletar curso" 
                                            onClick={(e) => {
                                                e.preventDefault(); // Previne o comportamento padrão do link
                                                handleDeletarCurso(curso.id);
                                            }}
                                        >
                                            Deletar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
