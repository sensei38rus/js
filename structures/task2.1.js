function kebabToCamel(str) {
    const words = str.split('-');
    
    let result = words[0]; 
    
    for (let i = 1; i < words.length; i++) {
        
        const word = words[i];
        const firstLetter = word.at(0).toUpperCase();
        const restOfWord = word.slice(1);
        
        result += firstLetter + restOfWord;
    }
    
    return result;
}

const string = prompt("введите строку") 
console.log(kebabToCamel(string))


