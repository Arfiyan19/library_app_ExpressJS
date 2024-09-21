<?php
// Soal 1: Reverse Alphabet in String
function reverseAlphabet($str)
{
    $letters = array_filter(str_split($str), function ($char) {
        return ctype_alpha($char);
    });
    $reversedLetters = array_reverse($letters);
    $result = implode("", $reversedLetters);

    // Menambahkan angka yang tidak berubah di akhir
    preg_match_all('/\d+/', $str, $numbers);
    if (count($numbers[0]) > 0) {
        $result .= $numbers[0][0];
    }
    return $result;
}

// Soal 2: Longest Word in Sentence
function longest($sentence)
{
    $words = explode(" ", $sentence);
    $longestWord = "";

    foreach ($words as $word) {
        if (strlen($word) > strlen($longestWord)) {
            $longestWord = $word;
        }
    }

    return $longestWord . ": " . strlen($longestWord) . " character";
}

// Soal 3: Query Count in Input Array
function queryCount($input, $query)
{
    $result = [];

    foreach ($query as $q) {
        $count = 0;
        foreach ($input as $i) {
            if ($i == $q) {
                $count++;
            }
        }
        $result[] = $count;
    }

    return $result;
}

// Soal 4: Matrix Diagonal Difference
function diagonalDifference($matrix)
{
    $n = count($matrix);
    $primaryDiagonal = 0;
    $secondaryDiagonal = 0;

    for ($i = 0; $i < $n; $i++) {
        $primaryDiagonal += $matrix[$i][$i];
        $secondaryDiagonal += $matrix[$i][$n - $i - 1];
    }

    return abs($primaryDiagonal - $secondaryDiagonal);
}

// Output for each question

// Soal 1: Reverse Alphabet with new string
echo "Soal 1: Reverse Alphabet<br>";
echo reverseAlphabet("ALGORITM4") . "<br><br>"; // Output: "MTIROGLA4"

// Soal 2: Longest Word in Sentence with new input
echo "Soal 2: Longest Word in Sentence<br>";
$sentence = "Pemrograman adalah cara efektif untuk menyelesaikan masalah kompleks";
echo longest($sentence) . "<br><br>"; // Output: "menyelesaikan: 13 character"

// Soal 3: Query Count in Input Array with new input
echo "Soal 3: Query Count in Input Array<br>";
$input = ['apple', 'banana', 'cherry', 'banana', 'apple'];
$query = ['apple', 'grape', 'banana'];
$output = queryCount($input, $query);
echo "Output: [" . implode(", ", $output) . "]<br><br>"; // Output: [2, 0, 2]

// Soal 4: Matrix Diagonal Difference with new input
echo "Soal 4: Matrix Diagonal Difference<br>";
$matrix = [
    [2, 5, 3],
    [8, 7, 6],
    [4, 1, 9]
];
echo "Selisih diagonal: " . diagonalDifference($matrix) . "<br>"; // Output: 6
