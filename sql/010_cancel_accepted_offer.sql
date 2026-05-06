-- 010_cancel_accepted_offer.sql
-- Allow seller to cancel an accepted offer and reopen the product.

-- ============================================================
-- 0. FIX PRODUCT ACTIVATION GUARD
-- Allow reserved → active so sellers can reopen products after
-- canceling an accepted offer/trade.
-- ============================================================

create or replace function public.prevent_seller_activation()
returns trigger
language plpgsql
as $function$
begin
  if new.status = 'active' and old.status != 'active' then
    -- Allow seller to reopen a reserved product (e.g. canceled accepted offer)
    if old.status = 'reserved' then
      return new;
    end if;
    -- Otherwise require admin approval (pending_approval, rejected, etc.)
    if not is_admin() then
      raise exception 'Solo los administradores pueden aprobar y activar productos.';
    end if;
  end if;
  return new;
end;
$function$;

-- ============================================================
-- 1. UPDATE STATUS TRANSITION GUARD
-- Allow accepted → invalidated so the seller can reopen a product
-- ============================================================

create or replace function enforce_offer_status_transition()
returns trigger
language plpgsql
as $$
begin
  -- Allow no-op (other columns changed, status unchanged)
  if new.status = old.status then
    return new;
  end if;

  -- Valid transitions from pending
  if old.status = 'pending' and new.status in (
    'accepted', 'rejected', 'countered', 'canceled', 'invalidated'
  ) then
    return new;
  end if;

  -- Seller can invalidate an accepted offer to reopen the product
  if old.status = 'accepted' and new.status = 'invalidated' then
    return new;
  end if;

  -- Countered offers can be invalidated
  if old.status = 'countered' and new.status = 'invalidated' then
    return new;
  end if;

  raise exception 'Invalid offer status transition: % → %', old.status, new.status;
end;
$$;

-- ============================================================
-- 2. CANCEL ACCEPTED OFFER (Seller-only)
-- Invalidates the offer and reopens the product to active.
-- ============================================================

create or replace function cancel_accepted_offer(p_offer_id uuid, p_actor_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_offer   offers%rowtype;
  v_product products%rowtype;
begin
  select * into v_offer
    from offers where id = p_offer_id
    for update;

  if not found then
    raise exception 'Offer not found';
  end if;

  select * into v_product
    from products where id = v_offer.product_id;

  if v_product.seller_id != p_actor_id then
    raise exception 'Only the seller can cancel an accepted offer';
  end if;

  if v_offer.status != 'accepted' then
    raise exception 'Only accepted offers can be canceled (current: %)', v_offer.status;
  end if;

  -- Invalidate the offer
  update offers
    set status = 'invalidated', updated_at = now()
    where id = p_offer_id;

  -- Reopen the product so other buyers can see it
  update products
    set status = 'active', updated_at = now()
    where id = v_offer.product_id;

  -- Log the action
  insert into offer_history (offer_id, actor_id, action, price_snapshot, notes)
  values (p_offer_id, p_actor_id, 'invalidated', v_offer.proposed_price, 'Seller canceled accepted offer to reopen product');
end;
$$;
