var prompt = require('prompt');
var _ = require('lodash');


function getInput() {
  console.log('Submit a sentence!');
  prompt.start();
  prompt.get(['First Sentence', 'Second Sentence'], function (err, result) {
    console.log('Cosine Similarity: ' + getCosineSimilarity(result['First Sentence'], result['Second Sentence']));
  });
}

function parseWords(doc) {
  return doc.split(' '); // Simple for now; should parse punctuation in the future
}

function createEmptyWordVector(doc1Words, doc2Words) {
  return _.reduce(doc1Words.concat(doc2Words), function(bin, word) {
    bin[word] = 0;
    return bin;
  }, {});
}

function populateWordVector(words, wordBin) {
  var wordBinClone = _.clone(wordBin); // necessary so as not to mutate original wordBin
  return _.reduce(words, function(counts, word) {
    counts[word]++;
    return counts;
  }, wordBinClone);
}

function dot(vector1, vector2) { // faster than Math.cos?
  var sum = 0;
  _.forIn(vector1, function(val, key) {
    sum += vector1[key] * vector2[key]; // not pure :(
  });
  return sum;
}

function magnitude(vector) {
  return Math.sqrt(dot(vector, vector));
}

function getCosineSimilarity(doc1, doc2) {
  var doc1Words = parseWords(doc1);
  var doc2Words = parseWords(doc2);

  var emptyWordsVector = createEmptyWordVector(doc1Words, doc2Words);

  var vector1 = populateWordVector(doc1Words, emptyWordsVector);
  var vector2 = populateWordVector(doc2Words, emptyWordsVector);

  return cosineSimilarity(vector1, vector2);
}

function cosineSimilarity(vector1, vector2) {
  return dot(vector1, vector2) / (magnitude(vector1) * magnitude(vector2));
}

getInput();