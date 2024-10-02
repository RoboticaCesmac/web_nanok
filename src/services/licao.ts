import { db } from "@/config/firebase";
import { collection, getDocs, addDoc, query, where, doc } from "firebase/firestore";

const LicaoService = {
    async buscarUnidades() {
        try {
            const unidadesList: any[] = [];
            const querySnapshot = await getDocs(collection(db, "Unidade"));

            querySnapshot.forEach((doc) => {
                unidadesList.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });

            console.log("Unidades buscadas: ", unidadesList); // Verifica se está retornando as unidades corretamente
            return unidadesList;
        } catch (error) {
            console.error("Erro ao buscar unidades: ", error);
            return [];
        }
    },

    async criarLicao({ titulo, conteudo, imagem, unidade, ordem }: { titulo: string; conteudo?: string; imagem?: string; unidade: string; ordem: number; }) {
        try {
            // Verifica se já existe uma lição com a mesma ordem para a unidade selecionada
            const existingLessons = await this.buscarLicoesPorUnidadeEOrdem(unidade, ordem);
            if (existingLessons.length > 0) {
                return { sucesso: false, mensagem: "Já existe uma lição nessa ordem para esta unidade." };
            }

            const unidadeRef = doc(db, "Unidade", unidade);
            const docRef = await addDoc(collection(db, "Licao"), {
                titulo,
                conteudo,
                imagem,
                unidade: unidadeRef,
                ordem,
            });

            return { sucesso: true, id: docRef.id, mensagem: "Lição criada com sucesso!" };
        } catch (error) {
            console.error("Erro ao criar lição: ", error);
            return { sucesso: false, mensagem: "Falha ao criar a lição. Tente novamente." };
        }
    },

    async buscarLicoesPorUnidadeEOrdem(unidade: string, ordem: number) {
        try {
            // Consulta filtrando pela unidade e ordem
            const q = query(
                collection(db, "Licao"),
                where("unidade", "==", doc(db, "Unidade", unidade)),
                where("ordem", "==", ordem)
            );
            const querySnapshot = await getDocs(q);

            // Retorna a lista de lições que correspondem à unidade e à ordem
            return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Erro ao buscar lições: ", error);
            return [];
        }
    },
};

export default LicaoService;
