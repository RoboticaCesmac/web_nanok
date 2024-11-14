import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '@/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const useUsuarioService = () => {
    // Função de login
    const logar = async (email: string, senha: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Verifica se o usuário existe na coleção "Admin"
            const q = query(collection(db, "Admin"), where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                return { sucesso: true, usuario: user };
            } else {
                return { sucesso: false, usuario: null };
            }
        } catch (error) {
            console.error("Erro ao logar:", error);
            return { sucesso: false, usuario: null };
        }
    };

    // Função para recuperação de senha
    const recuperarSenha = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { sucesso: true };
        } catch (error) {
            console.error("Erro ao enviar email de recuperação:", error);
            return { sucesso: false };
        }
    };

    return { logar, recuperarSenha };
};
