"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LicaoService from "@/services/licao";
import { AdminHeader } from "@/app/admin/components";

export default function EditarLicao({ params }) {
    const router = useRouter();
    const { id: licaoId } = params; // Pegando os parâmetros da URL
    const [titulo, setTitulo] = useState("");
    const [conteudo, setConteudo] = useState("");
    const [ordem, setOrdem] = useState<number | null>(null);
    const [imagem, setImagem] = useState<File | null>(null); // Estado para a imagem
    const [loading, setLoading] = useState(true);
    const [imagemUrlAtual, setImagemUrlAtual] = useState(""); // URL da imagem atual
    const [novaImagemUrl, setNovaImagemUrl] = useState<string | null>(null); // URL da nova imagem para pré-visualização
    const [imagemSubstituida, setImagemSubstituida] = useState(false); // Estado para controlar a exibição da imagem

    // UseEffect para buscar a lição ao carregar o componente
    useEffect(() => {
        const fetchLicao = async () => {
            const licao = await LicaoService.buscarLicaoPorId(licaoId);
            if (licao) {
                setTitulo(licao.titulo);
                setConteudo(licao.conteudo);
                setOrdem(licao.ordem);
                setImagemUrlAtual(licao.imagemUrl || ""); // Armazena a URL atual da imagem
            } else {
                alert("Lição não encontrada");
            }
            setLoading(false);
        };
        fetchLicao();
    }, [licaoId]);

    // Função para ler a nova imagem e gerar a URL de pré-visualização
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setImagem(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNovaImagemUrl(reader.result as string); // Armazena a URL da nova imagem
                setImagemSubstituida(true); // Marca que a nova imagem foi substituída
            };
            reader.readAsDataURL(file); // Lê o arquivo como URL de dados
        } else {
            setNovaImagemUrl(null); // Reseta a URL se nenhum arquivo for selecionado
        }
    };

    const editarLicao = async () => {
        if (!titulo || ordem === null) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        let novaImagemUrlFinal = imagemUrlAtual; // Começamos com a imagem atual

        // Se uma nova imagem foi selecionada, fazemos o upload
        if (imagem) {
            novaImagemUrlFinal = await LicaoService.uploadImagem(imagem);
        }

        const { sucesso, mensagem } = await LicaoService.editarLicao(licaoId, {
            titulo,
            conteudo: conteudo || "",
            ordem,
            imagemUrl: novaImagemUrlFinal, // Atualiza com a nova URL da imagem
        });

        if (sucesso) {
            alert("Lição editada com sucesso!");
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
                    onChange={(e) => setConteudo(e.target.value.slice(0, 350))}
                    maxLength={350}
                />
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {`${conteudo.length}/350`}
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
            {/* Exibir a imagem já salva */}
            {!imagemSubstituida && imagemUrlAtual && (
                <img
                    src={imagemUrlAtual}
                    alt="Imagem atual da lição"
                    style={{ width: "180px", height: "180px", marginTop: "10px", border: '2px solid #007bff' }}
                />
            )}
            {/* Campo para fazer o upload da nova imagem */}
            <div className="d-flex flex-column px-2 py-2">
                <input
                    type="file"
                    className="form-control-file"
                    onChange={handleImageChange} // Atualiza a imagem e gera a pré-visualização
                />
                {/* Exibir a pré-visualização da nova imagem, se existir */}
                {novaImagemUrl && (
                    <img
                        src={novaImagemUrl}
                        alt="Pré-visualização da nova imagem"
                        style={{ width: "180px", height: "180px", marginTop: "10px", border: '2px solid #007bff' }}
                    />
                )}
            </div>
            <button className="btn btn-primary" onClick={editarLicao}>Salvar Lição</button>
        </main>
    );
}
