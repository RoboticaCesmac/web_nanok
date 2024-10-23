import { db } from "@/config/firebase";
import {
    collection,
    getDocs,
    addDoc,
    query,
    where,
    doc,
    deleteDoc,
    orderBy,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Interfaces para os dados
interface Unidade {
    id: string;
    nomeUnidade: string;
}

interface Licao {
    id: string;
    titulo: string;
    conteudo: string;
    unidade: string; // Referência à unidade
    ordem: number;
    imagemUrl?: string; // Adicionando campo para URL da imagem
}

interface CriarLicaoInput {
    titulo: string;
    conteudo: string;
    unidade: string;
    ordem: number;
    imagemUrl?: string;
}

const LicaoService = {
    // Função para buscar unidades
    async buscarUnidades(): Promise<Unidade[]> {
        try {
            const unidadesList: Unidade[] = [];
            const unidadesRef = collection(db, "Unidade");
            const unidadesSnapshot = await getDocs(unidadesRef);
            unidadesSnapshot.forEach((unidadeDoc) => {
                unidadesList.push({
                    id: unidadeDoc.id,
                    ...unidadeDoc.data(),
                } as Unidade);
            });
            return unidadesList;
        } catch (error) {
            console.error("Erro ao buscar unidades: ", error);
            return [];
        }
    },

    // Função para fazer upload da imagem
    async uploadImagem(imagem: File): Promise<string> {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `licoes/${imagem.name}`);
            const snapshot = await uploadBytes(storageRef, imagem);
            const url = await getDownloadURL(snapshot.ref);
            return url; // Retorna a URL para salvar no Firestore
        } catch (error) {
            console.error("Erro ao fazer upload da imagem: ", error);
            throw error;
        }
    },

    // Buscar lições por unidade e organizar por ordem
    async buscarLicoesPorUnidade(unidadeId: string): Promise<Licao[]> {
        try {
            const q = query(
                collection(db, "Licao"),
                where("unidade", "==", doc(db, "Unidade", unidadeId)),
                orderBy("ordem", "asc") // Ordena pelo campo ordem
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Licao[];
        } catch (error) {
            console.error("Erro ao buscar lições: ", error);
            return [];
        }
    },

    // Função para criar uma nova lição
    async criarLicao({ titulo, conteudo, unidade, ordem, imagemUrl }: CriarLicaoInput) {
        try {
            const licaoRef = await addDoc(collection(db, "Licao"), {
                titulo,
                conteudo,
                unidade: doc(db, "Unidade", unidade),
                ordem,
                imagemUrl,  // Incluindo a URL da imagem
            });
            return { sucesso: true, id: licaoRef.id };
        } catch (error) {
            console.error("Erro ao criar lição: ", error);
            return { sucesso: false, mensagem: "Falha ao criar a lição." };
        }
    },

    // Função para deletar lição
    async deletarLicao(licaoId: string): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            const licaoRef = doc(db, "Licao", licaoId);
            await deleteDoc(licaoRef);
            return { sucesso: true, mensagem: "Lição deletada com sucesso!" };
        } catch (error) {
            console.error("Erro ao deletar lição: ", error);
            return { sucesso: false, mensagem: "Erro ao deletar lição." };
        }
    },

    // Função para buscar uma lição específica pelo ID
    async buscarLicaoPorId(licaoId: string): Promise<Licao | null> {
        try {
            const licaoRef = doc(db, "Licao", licaoId);
            const licaoSnapshot = await getDoc(licaoRef);

            if (licaoSnapshot.exists()) {
                return { id: licaoSnapshot.id, ...licaoSnapshot.data() } as Licao;
            } else {
                throw new Error("Lição não encontrada");
            }
        } catch (error) {
            console.error("Erro ao buscar lição: ", error);
            return null;
        }
    },

    // Função para editar uma lição
    async editarLicao(
        licaoId: string,
        dadosAtualizados: Partial<Omit<Licao, 'id'>>
    ): Promise<{ sucesso: boolean; mensagem?: string }> {
        try {
            const licaoRef = doc(db, "Licao", licaoId);
            await updateDoc(licaoRef, dadosAtualizados);
            return { sucesso: true, mensagem: "Lição atualizada com sucesso!" };
        } catch (error) {
            console.error("Erro ao editar lição: ", error);
            return { sucesso: false, mensagem: "Erro ao atualizar lição." };
        }
    },
};

export default LicaoService;
