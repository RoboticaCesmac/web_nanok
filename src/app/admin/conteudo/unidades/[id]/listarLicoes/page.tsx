"use client";

import React, { useEffect, useState } from "react";
import LicaoService from "@/services/licao";
import UnidadeService from "@/services/unidade"; // Importando o serviço de unidade
import { AdminHeader } from "@/app/admin/components";
import Link from "next/link";

interface Licao {
    id: string;
    titulo: string;
    ordem: number;
}

interface LicoesProps {
    params: {
        id: string; // Unidade ID
    };
}

export default function Licoes({ params }: LicoesProps) {
    const unidadeId = params.id; // ID da unidade vindo da URL

    const [licoes, setLicoes] = useState<Licao[]>([]);
    const [unidadeNome, setUnidadeNome] = useState(""); // Estado para armazenar o nome da unidade
    const [loading, setLoading] = useState(true);

    // Buscar as lições e o nome da unidade quando a página carrega
    useEffect(() => {
        const buscarDados = async () => {
            // Buscar lições da unidade
            const licoes = await LicaoService.buscarLicoesPorUnidade(unidadeId);
            setLicoes(licoes);

            // Buscar nome da unidade pelo ID
            const { sucesso, unidade } = await UnidadeService.buscarUnidadePorId(unidadeId);
            if (sucesso && unidade) {
                setUnidadeNome(unidade.nomeUnidade);
            } else {
                alert("Erro ao buscar informações da unidade.");
            }

            setLoading(false);
        };

        buscarDados();
    }, [unidadeId]);

    // Função para deletar uma lição
    const handleDeletarLicao = async (licaoId: string) => {
        const { sucesso, mensagem } = await LicaoService.deletarLicao(licaoId);
        if (sucesso) {
            // Atualizar a lista de lições após a exclusão
            setLicoes(licoes.filter((licao) => licao.id !== licaoId));
            alert("Lição deletada com sucesso.");
        } else {
            alert("Erro ao deletar lição: " + mensagem);
        }
    };

    if (loading) {
        return <div>Carregando lições...</div>;
    }

    return (
        <main>
            <AdminHeader titulo={`Lições da unidade: ${unidadeNome}`} /> {/* Exibe o nome da unidade no título */}
            <table className="table align-items-center mb-0">
                <thead>
                    <tr>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Título</th>
                        <th className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ordem</th>
                        <th className="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {licoes.map((licao) => (
                        <tr key={licao.id}>
                            <td>
                                <div className="d-flex px-2 py-1">
                                    <div className="d-flex flex-column justify-content-center">
                                        <h6 className="mb-0 text-sm">{licao.titulo}</h6>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className="text-xs text-secondary mb-0">{licao.ordem}</p>
                            </td>
                            <td className="align-middle text-center text-sm">
                                <Link
                                    href={`/admin/conteudo/licoes/editar/${licao.id}`}
                                    className="text-primary font-weight-bold text-xs"
                                >
                                    Editar
                                </Link>
                                <span className="mx-2">|</span>
                                <Link
                                    href="#"
                                    className="text-danger font-weight-bold text-xs"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeletarLicao(licao.id);
                                    }}
                                >
                                    Deletar
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}
