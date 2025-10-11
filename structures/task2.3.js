function translate(text, targetLanguage) {
  
    const dictionary = {
        'hello': {
            'ru': 'привет',
            'es': 'hola',
            'fr': 'bonjour',
            'de': 'hallo'
        },
        'world': {
            'ru': 'мир',
            'es': 'mundo',
            'fr': 'monde',
            'de': 'welt'
        },
        'good': {
            'ru': 'хороший',
            'es': 'bueno',
            'fr': 'bon',
            'de': 'gut'
        },
        'morning': {
            'ru': 'утро',
            'es': 'mañana',
            'fr': 'matin',
            'de': 'morgen'
        }
    };
    
    
    const words = text.toLowerCase().split(' ');
    
  
    const translatedWords = words.map(word => {
       
        if (dictionary[word] && dictionary[word][targetLanguage]) {
            return dictionary[word][targetLanguage];
        }
        
        return word;
    });
    
   
    return translatedWords.join(' ');
}


console.log(translate('hello world', 'ru')); 
console.log(translate('good morning', 'es')); 
console.log(translate('hello good world', 'fr')); 
console.log(translate('morning world', 'de')); 
console.log(translate('unknown word', 'ru')); 