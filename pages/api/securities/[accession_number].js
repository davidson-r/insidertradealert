import pool from '../../../db';

export default async function handler(req, res) {
    const { accession_number } = req.query;

    if (accession_number==='0'){
        return res.status(200).json([])
    }

      var securities = await pool.query(
        `SELECT 
        accession_number,
        is_non_derivative, 
        holding,
        to_char(transaction_date,'yyyy-mm-dd')transaction_date,
        idx,
        conversion_or_exercise_price,
        to_char(exercise_date,'yyyy-mm-dd')exercise_date,
        to_char(expiration_date,'yyyy-mm-dd')expiration_date,
        direct_or_indirect_ownership,
        nature_of_ownership,
        shares_owned_following_transaction,
        security_title,
        transaction_acquired_disposed_code,
        transaction_price_per_share,
        transaction_shares,
        transaction_code
    FROM  derivative where accession_number=$1
    order by accession_number,is_non_derivative,holding,idx	`, [accession_number]
    )

  res.status(200).json(securities.rows)
}



