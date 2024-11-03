// /app/index.js
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Marca el componente como montado
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Redirige automáticamente a la pantalla de signup solo cuando el componente está montado
      router.push('/signup');
    }
  }, [isMounted, router]);

  return null; // No renderiza nada porque redirige inmediatamente
}
