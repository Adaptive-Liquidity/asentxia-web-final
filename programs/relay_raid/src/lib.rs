use anchor_lang::prelude::*;

declare_id!("5sCw7dCGrtqKvbs84UPqvGsBYgmYUruqYADnUUpgCJHH");

pub const SEASON_VERSION: u8 = 1;
pub const RECEIPT_VERSION: u8 = 1;
pub const ROUND_SCORE_MAX: u32 = 999_999;

#[program]
pub mod relay_raid {
    use super::*;

    pub fn initialize_season(
        ctx: Context<InitializeSeason>,
        season_id: u64,
        start_at: i64,
        end_at: i64,
        attestor: Pubkey,
    ) -> Result<()> {
        require!(end_at > start_at, RelayRaidError::InvalidSeasonDuration);
        require!(attestor != Pubkey::default(), RelayRaidError::InvalidAttestor);

        let season = &mut ctx.accounts.season;
        season.version = SEASON_VERSION;
        season.bump = ctx.bumps.season;
        season.active = true;
        season.season_id = season_id;
        season.authority = ctx.accounts.authority.key();
        season.attestor = attestor;
        season.start_at = start_at;
        season.end_at = end_at;
        Ok(())
    }

    pub fn create_profile(ctx: Context<CreateProfile>) -> Result<()> {
        require!(ctx.accounts.season.active, RelayRaidError::SeasonInactive);

        let profile = &mut ctx.accounts.player_profile;
        profile.bump = ctx.bumps.player_profile;
        profile.season = ctx.accounts.season.key();
        profile.player = ctx.accounts.player.key();
        profile.created_at = Clock::get()?.unix_timestamp;
        profile.revoked = false;
        Ok(())
    }

    pub fn claim_receipt(
        ctx: Context<ClaimReceipt>,
        nonce: [u8; 16],
        score: u32,
        input_digest: [u8; 32],
        expires_at: i64,
    ) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let season = &ctx.accounts.season;
        let profile = &ctx.accounts.player_profile;

        require!(season.active, RelayRaidError::SeasonInactive);
        require!(now >= season.start_at && now <= season.end_at, RelayRaidError::SeasonNotActive);
        require!(now <= expires_at, RelayRaidError::ClaimExpired);
        require!(expires_at <= season.end_at, RelayRaidError::ClaimExpiryOutsideSeason);
        require!(score <= ROUND_SCORE_MAX, RelayRaidError::ScoreOutOfRange);
        require!(!profile.revoked, RelayRaidError::ProfileRevoked);

        let receipt = &mut ctx.accounts.round_receipt;
        receipt.version = RECEIPT_VERSION;
        receipt.bump = ctx.bumps.round_receipt;
        receipt.season = season.key();
        receipt.player = ctx.accounts.player.key();
        receipt.nonce = nonce;
        receipt.score = score;
        receipt.input_digest = input_digest;
        receipt.issued_at = now;
        receipt.expires_at = expires_at;
        Ok(())
    }

    pub fn set_profile_revoked(ctx: Context<SetProfileRevoked>, revoked: bool) -> Result<()> {
        ctx.accounts.player_profile.revoked = revoked;
        Ok(())
    }

    pub fn close_season(ctx: Context<CloseSeason>) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        require!(now >= ctx.accounts.season.end_at, RelayRaidError::SeasonStillOpen);
        ctx.accounts.season.active = false;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(season_id: u64)]
pub struct InitializeSeason<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + Season::INIT_SPACE,
        seeds = [b"season", &season_id.to_le_bytes()],
        bump
    )]
    pub season: Account<'info, Season>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub player: Signer<'info>,
    #[account(
        seeds = [b"season", &season.season_id.to_le_bytes()],
        bump = season.bump,
        constraint = season.active @ RelayRaidError::SeasonInactive
    )]
    pub season: Account<'info, Season>,
    #[account(
        init,
        payer = payer,
        space = 8 + PlayerProfile::INIT_SPACE,
        seeds = [b"player", season.key().as_ref(), player.key().as_ref()],
        bump
    )]
    pub player_profile: Account<'info, PlayerProfile>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(nonce: [u8; 16])]
pub struct ClaimReceipt<'info> {
    #[account(
        seeds = [b"season", &season.season_id.to_le_bytes()],
        bump = season.bump
    )]
    pub season: Account<'info, Season>,
    #[account(
        seeds = [b"player", season.key().as_ref(), player.key().as_ref()],
        bump = player_profile.bump,
        constraint = player_profile.season == season.key() @ RelayRaidError::ProfileSeasonMismatch,
        constraint = player_profile.player == player.key() @ RelayRaidError::ProfilePlayerMismatch
    )]
    pub player_profile: Account<'info, PlayerProfile>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(address = season.attestor @ RelayRaidError::UnauthorizedAttestor)]
    pub attestor: Signer<'info>,
    #[account(
        init,
        payer = player,
        space = 8 + RoundReceipt::INIT_SPACE,
        seeds = [b"receipt", season.key().as_ref(), player.key().as_ref(), nonce.as_ref()],
        bump
    )]
    pub round_receipt: Account<'info, RoundReceipt>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetProfileRevoked<'info> {
    #[account(has_one = authority @ RelayRaidError::UnauthorizedAuthority)]
    pub season: Account<'info, Season>,
    #[account(mut, constraint = player_profile.season == season.key() @ RelayRaidError::ProfileSeasonMismatch)]
    pub player_profile: Account<'info, PlayerProfile>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseSeason<'info> {
    #[account(mut, has_one = authority @ RelayRaidError::UnauthorizedAuthority)]
    pub season: Account<'info, Season>,
    pub authority: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Season {
    pub version: u8,
    pub bump: u8,
    pub active: bool,
    pub season_id: u64,
    pub authority: Pubkey,
    pub attestor: Pubkey,
    pub start_at: i64,
    pub end_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct PlayerProfile {
    pub bump: u8,
    pub season: Pubkey,
    pub player: Pubkey,
    pub created_at: i64,
    pub revoked: bool,
}

#[account]
#[derive(InitSpace)]
pub struct RoundReceipt {
    pub version: u8,
    pub bump: u8,
    pub season: Pubkey,
    pub player: Pubkey,
    pub nonce: [u8; 16],
    pub score: u32,
    pub input_digest: [u8; 32],
    pub issued_at: i64,
    pub expires_at: i64,
}

#[error_code]
pub enum RelayRaidError {
    #[msg("The season end time must be after the start time.")]
    InvalidSeasonDuration,
    #[msg("The attestor cannot be the default public key.")]
    InvalidAttestor,
    #[msg("The season is inactive.")]
    SeasonInactive,
    #[msg("The current time is outside the active season.")]
    SeasonNotActive,
    #[msg("The receipt grant has expired.")]
    ClaimExpired,
    #[msg("The receipt grant expiry is outside the season window.")]
    ClaimExpiryOutsideSeason,
    #[msg("The score exceeds the ruleset maximum.")]
    ScoreOutOfRange,
    #[msg("The player profile is revoked from new claims.")]
    ProfileRevoked,
    #[msg("The supplied attestor does not match the season.")]
    UnauthorizedAttestor,
    #[msg("The player profile belongs to another season.")]
    ProfileSeasonMismatch,
    #[msg("The player profile belongs to another player.")]
    ProfilePlayerMismatch,
    #[msg("Only the season authority may perform this action.")]
    UnauthorizedAuthority,
    #[msg("The season cannot close before its configured end time.")]
    SeasonStillOpen,
}
