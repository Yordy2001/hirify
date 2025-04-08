export const futureDateValidator = (control: any) => {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar horas para solo comparar fechas

    return selectedDate >= today ? null : { pastDate: true };
}

export const pmTimeValidator = (control: any) => {
    const selectedTime = control.value;
    if (!selectedTime) return null;

    const [hours] = selectedTime.split(':').map(Number);
    return hours >= 12 ? null : { invalidTime: true };
}