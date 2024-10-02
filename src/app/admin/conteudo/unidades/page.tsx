"use client";

import React, { useEffect, useState } from "react";
import UnidadeService from "@/services/unidade"; // Importe o serviço de unidade
import { AdminHeader } from "../../components";
import Link from "next/link";

interface Unidade {
    id: string;
    nomeUnidade: string;
    referenciaCurso: string;
    nomeCurso: string;
}

export default function Unidades() {
    const [unidades, setUnidades] = useState<Unidade[]>([]);
    const [pesquisa, setPesquisa] = useState("");

    // Busca as unidades ao carregar a página
    useEffect(() => {
        const buscarUnidades = async () => {
            const { sucesso, unidades } = await UnidadeService.buscarUnidades();
            if (sucesso && unidades) {
                setUnidades(unidades);
            } else {
                alert("Erro ao buscar unidades.");
            }
        };
        buscarUnidades();
    }, []);

    const handleDeletarUnidade = async (id: string) => {
        const { sucesso } = await UnidadeService.deletarUnidade(id);
        if (sucesso) {
            setUnidades(unidades.filter(unidade => unidade.id !== id));
            alert("Unidade deletada com sucesso.");
        } else {
            alert("Erro ao deletar unidade.");
        }
    };

    // Filtra as unidades com base na pesquisa
    const unidadesFiltradas = unidades.filter(unidade => 
        unidade.nomeUnidade.toLowerCase().includes(pesquisa.toLowerCase())
    );

    // Organiza as unidades por curso
    const unidadesPorCurso = unidadesFiltradas.reduce((acc, unidade) => {
        const { nomeCurso } = unidade;
        if (!acc[nomeCurso]) {
            acc[nomeCurso] = [];
        }
        acc[nomeCurso].push(unidade);
        return acc;
    }, {} as Record<string, Unidade[]>);

    return (
        <main>
            <AdminHeader titulo='Unidades'>
                <Link className='btn btn-primary' href="/admin/criarUnidade">Nova Unidade</Link>
            </AdminHeader>

            <div className="card-header pb-0">
                <h6>Itens</h6>
                <input
                    type="text"
                    placeholder="Pesquisar unidades"
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    style={{ margin: "10px 0", padding: "5px", width: "30%" }} // Ajuste do tamanho da barra de pesquisa
                />
            </div>
            <div className="card-body px-0 pt-0 pb-2">
                <div className="table-responsive p-0">
                    <table className="table align-items-center mb-0">
                        <thead>
                            <tr>
                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Unidade</th>
                                <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Curso</th>
                                <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(unidadesPorCurso).map(([curso, unidades]) => (
                                <React.Fragment key={curso}>
                                    <tr>
                                        <td colSpan={3} className="text-secondary font-weight-bold">{curso}</td>
                                    </tr>
                                    {unidades.map((unidade) => (
                                        <tr key={unidade.id}>
                                            <td>
                                                <div className="d-flex px-2 py-1">
                                                    <div className="d-flex flex-column justify-content-center">
                                                        <h6 className="mb-0 text-sm">{unidade.nomeUnidade}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p className="text-xs text-secondary mb-0">{unidade.nomeCurso}</p>
                                            </td>
                                            <td className="align-middle text-center text-sm">
                                                <Link 
                                                    href="#" 
                                                    className="text-danger font-weight-bold text-xs" 
                                                    data-toggle="tooltip" 
                                                    data-original-title="Deletar unidade" 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDeletarUnidade(unidade.id);
                                                    }}
                                                >
                                                    Deletar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
