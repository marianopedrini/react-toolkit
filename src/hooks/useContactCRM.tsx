// --- Mockup types & constants ---

type RequestType = 'complaint' | 'request' | 'suggestion';

type ContactFormData = {
    type: RequestType;
    reason: string;
    subReason?: string;
    description: string;
    documents?: File[];
};

type UseSubmitContactFormParams = {
    onSuccess?: (data: { id: string }) => void;
    onError?: (error: Error) => void;
};

import { useQuery, useMutation } from '@tanstack/react-query';

const CACHE_TIMES = {
    default: 10 * 60 * 1000, // 10 minutes
    documents: 24 * 60 * 60 * 1000, // 24 hours
    client: 5 * 60 * 1000, // 5 minutes
};

// --- Mockup API functions ---

async function getContactSubReasons(type: RequestType, reason: string) {
    return [
        { id: '1', label: `Sub-reason A for ${reason} (${type})` },
        { id: '2', label: `Sub-reason B for ${reason} (${type})` },
    ];
}

async function submitContactForm(formData: ContactFormData) {
    return {
        id: 'form-123',
        descripcionError: null,
        status: 'submitted' as const,
    };
}

/*
**Detalles clave:**

- La flag `enabled` crea *dropdowns* en cascada: los submotivos solo se solicitan cuando se selecciona un motivo
- Diferentes `staleTime` / `gcTime` según el tipo de dato (24 h para tipos de documento, 5 min para datos del cliente, 10 min por defecto)
- Las subidas de archivos son secuenciales: el formulario debe enviarse correctamente antes de enviar los adjuntos
*/

// Query key factory — type-safe, hierarchical
const CRM_QUERY_KEYS = {
    contactDocumentTypes: ['crm', 'contactDocumentTypes'] as const,
    clientByDocument: (documentNumber: string) =>
        ['crm', 'clientByDocument', documentNumber] as const,
    contactReasonsByType: (type: RequestType) =>
        ['crm', 'contactReasonsByType', type] as const,
    contactSubReasonsByReason: (type: RequestType, reason: string) =>
        ['crm', 'contactSubReasonsByReason', type, reason] as const,
} as const;

// Cascading queries — sub-reasons depend on reason selection
export function useSubReasonsByReason(type: RequestType, reason: string) {
    return useQuery({
        queryKey: CRM_QUERY_KEYS.contactSubReasonsByReason(type, reason),
        queryFn: () => getContactSubReasons(type, reason),
        staleTime: CACHE_TIMES.default, // 10 minutes
        gcTime: CACHE_TIMES.default,
        enabled: !!type && !!reason, // Only fetches when both values exist
    });
}

// Mutation with sequential file upload
export function useSubmitContactForm(params?: UseSubmitContactFormParams) {
    return useMutation({
        mutationFn: async ({ formData }: { formData: ContactFormData }) => {
            const response = await submitContactForm(formData);
            return response;
        },
    });
}

// --- Usage example ---
//
// function ContactPage() {
//     const [type] = useState<RequestType>('complaint');
//     const [reason] = useState('billing');
//
//     const { data: subReasons, isLoading } = useSubReasonsByReason(type, reason);
//     const { mutate: submit, isPending } = useSubmitContactForm();
//
//     const handleSubmit = () => {
//         submit({
//             formData: {
//                 type,
//                 reason,
//                 subReason: subReasons?.[0]?.id,
//                 description: 'Issue with my last invoice',
//             },
//         });
//     };
//
//     return (
//         <div>
//             {isLoading && <p>Loading sub-reasons...</p>}
//             {subReasons?.map((sr) => <span key={sr.id}>{sr.label}</span>)}
//             <button onClick={handleSubmit} disabled={isPending}>Submit</button>
//         </div>
//     );
// }
