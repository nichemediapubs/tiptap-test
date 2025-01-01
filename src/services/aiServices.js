export const aiCommand = async (command) => {
    const response = await fetch(`http://localhost:3035?command=${command}`);
     // Read the response body as a stream
     const reader = response.body.getReader();
     const decoder = new TextDecoder(); // Decode the chunks
     let streamText = '';
     while (true) {
       const { done, value } = await reader.read();
 
       if (done) {
         break; // Exit loop when the stream ends
       }
 
       // Decode and append the chunk to the displayed text
       streamText += decoder.decode(value, { stream: true });
     }
}