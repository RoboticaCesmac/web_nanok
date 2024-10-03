"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LicaoService from "@/services/licao";
import { AdminHeader } from "@/app/admin/components";

export default function EditarLicao({ params }) {
    const router = useRouter();
    const { id: licaoId, unidadeId } = params; // Pegando os parâmetros da URL
    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [ordem, setOrdem] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // UseEffect para buscar a lição ao carregar o componente
    useEffect(() => {
        const fetchLicao = async () => {
            const licao = await LicaoService.buscarLicaoPorId(licaoId);
            if (licao) {
                setTitulo(licao.titulo);
                setConteudo(licao.conteudo);
                setOrdem(licao.ordem);
            } else {
                alert("Lição não encontrada");
            }
            setLoading(false);
        };
        fetchLicao();
    }, [licaoId]);

    const editarLicao = async () => {
        if (!titulo || ordem === null) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        const { sucesso, mensagem } = await LicaoService.editarLicao(licaoId, {
            titulo,
            conteudo: conteudo || "",
            ordem,
        });

        if (sucesso) {
            alert("Lição editada com sucesso!");
            // Usando o unidadeId correto para redirecionar
            router.back();
        } else {
            alert(mensagem || "Falha ao editar a lição. Tente novamente.");
        }
    };

    if (loading) {
        return <div>Carregando lição...</div>;
    }

    return (
        <main>
            <AdminHeader titulo='Editar Lição' />
            <div className="d-flex px-2 py-2">
                <input
                    type="text"
                    placeholder="Título da Lição"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value.slice(0, 25))}
                />
            </div>
            <div className="d-flex flex-column justify-content-center px-2 py-2">
                <textarea
                    placeholder="Conteúdo da Lição"
                    value={conteudo}
                    onChange={(e) => setConteudo(e.target.value.slice(0, 255))}
                    maxLength={255}
                />
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {`${conteudo.length}/255`}
                </div>
            </div>
            <div className="d-flex px-2 py-2">
                <input
                    type="number"
                    placeholder="Ordem (inteiro)"
                    value={ordem || ""}
                    onChange={(e) => setOrdem(parseInt(e.target.value, 10))}
                />
            </div>
            <button className="btn btn-primary" onClick={editarLicao}>Salvar Lição</button>
        </main>
    );
}
