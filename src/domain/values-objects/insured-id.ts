export const formatInsuredId = (insuredId: string): string => {
  return insuredId.padStart(5, '0'); // Asegura que tenga 5 dígitos
};
