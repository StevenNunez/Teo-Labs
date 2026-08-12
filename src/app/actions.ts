'use server';

import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor, introduce una dirección de correo electrónico válida.',
  }),
  message: z.string().min(10, {
    message: 'El mensaje debe tener al menos 10 caracteres.',
  }),
});

export type FormState = {
    message: string;
    status: 'idle' | 'success' | 'error';
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {

  const validatedFields = formSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Error de validación. Por favor, revisa los campos.',
    };
  }

  try {
    // Usando Web3Forms para mayor fiabilidad y mejor formato
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        access_key: '8e3b89ba-2751-4a5e-bd0c-35c83d890645',
        subject: `NUEVO CONTACTO: ${validatedFields.data.name}`,
        from_name: 'Web Teo Labs',
        to: 'steven@teolabs.app',
        "Nombre": validatedFields.data.name,
        "Email": validatedFields.data.email,
        "Mensaje": validatedFields.data.message
      }),
    });

    const result = await response.json();

    if (result.success) {
      return {
        status: 'success',
        message: '¡Tu mensaje ha sido enviado con éxito!',
      };
    } else {
      return {
        status: 'error',
        message: 'No se pudo enviar tu mensaje. Inténtalo de nuevo más tarde.',
      };
    }
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    return {
      status: 'error',
      message: 'Ocurrió un error inesperado al enviar el formulario.',
    };
  }
}
