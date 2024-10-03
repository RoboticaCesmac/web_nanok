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

const LicaoService = {
    // Buscar lições por unidade e organizar por ordem
    async buscarLicoesPorUnidade(unidadeId: string) {
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
            }));
        } catch (error) {
            console.error("Erro ao buscar lições: ", error);
            return [];
        }
    },

    // Função para deletar lição
    async deletarLicao(licaoId: string) {
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
    async buscarLicaoPorId(licaoId: string) {
        try {
            const licaoRef = doc(db, "Licao", licaoId);
            const licaoSnapshot = await getDoc(licaoRef);

            if (licaoSnapshot.exists()) {
                return { id: licaoSnapshot.id, ...licaoSnapshot.data() };
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
        dadosAtualizados: Partial<{
            titulo: string;
            conteudo?: string;
            imagem?: string;
            ordem: number;
        }>
    ) {
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
