<?php

namespace Drone\MapBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Drone\MapBundle\Entity\Drone;
use Drone\MapBundle\Form\DroneType;
use Symfony\Component\HttpFoundation\Response;

/**
 * Drone controller.
 *
 */
class DroneController extends Controller
{

	/**
	 * Lists all Drone entities.
	 *
	 */
	public function indexAction() {
		$em = $this->getDoctrine()->getManager();

		$entities = $em->getRepository('DroneMapBundle:Drone')->findAll();

		return $this->render('DroneMapBundle:Drone:index.html.twig', array(
			'entities' => $entities,
		));
	}

    /**
     * Creates a new Drone entity.
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|Response
     */
	public function createAction(Request $request) {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$entity = new Drone();
		$form = $this->createCreateForm($entity);
		$form->handleRequest($request);

		if ($form->isValid()) {
			$user->addDrone($entity);

			$em = $this->getDoctrine()->getManager();
			$em->persist($entity);
			$em->flush();

			return $this->redirect($this->generateUrl('drone_show', array('id' => $entity->getId())));
		}

		return $this->render('DroneMapBundle:Drone:new.html.twig', array(
			'entity' => $entity,
			'form'   => $form->createView(),
		));
	}

	/**
	 * Creates a form to create a Drone entity.
	 *
	 * @param Drone $entity The entity
	 *
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createCreateForm(Drone $entity) {
		$form = $this->createForm(new DroneType(), $entity, array(
			'action' => $this->generateUrl('drone_create'),
			'method' => 'POST',
		));

		$form->add('submit', 'submit', array(
			'label' => 'Créer',
			'attr'  => array(
					'class' => 'btn btn-primary'
				)
			));

		return $form;
	}

	/**
	 * Displays a form to create a new Drone entity.
	 *
	 */
	public function newAction() {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$entity = new Drone();
		$form   = $this->createCreateForm($entity);

		return $this->render('DroneMapBundle:Drone:new.html.twig', array(
			'entity' => $entity,
			'form'   => $form->createView(),
		));
	}

    /**
     * Finds and displays a Drone entity.
     * @param $id
     * @return Response
     */
	public function showAction($id) {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$em = $this->getDoctrine()->getManager();

		$entity = $em->getRepository('DroneMapBundle:Drone')->find($id);

		if (!$entity) {
			throw $this->createNotFoundException('Unable to find Drone entity.');
		}

		$deleteForm = $this->createDeleteForm($id);

		return $this->render('DroneMapBundle:Drone:show.html.twig', array(
			'entity'      => $entity,
			'delete_form' => $deleteForm->createView(),
		));
	}

    /**
     * Displays a form to edit an existing Drone entity.
     * @param $id
     * @return Response
     */
	public function editAction($id) {
		$user = $this->getUser();
		if(!$user){
			throw $this->createNotFoundException('Utilisateur non connecté');
		}

		$em = $this->getDoctrine()->getManager();

		$entity = $em->getRepository('DroneMapBundle:Drone')->find($id);

		if (!$entity) {
			throw $this->createNotFoundException('Unable to find Drone entity.');
		}

		$editForm   = $this->createEditForm($entity);
		$deleteForm = $this->createDeleteForm($id);

		return $this->render('DroneMapBundle:Drone:edit.html.twig', array(
			'entity'      => $entity,
			'edit_form'   => $editForm->createView(),
			'delete_form' => $deleteForm->createView(),
		));
	}

    /**
     * Displays a form to manage an existing Drone entity.
     * @param $id
     * @return Response
     */
	public function manageAction($id) {
		$em = $this->getDoctrine()->getManager();

		$entity = $em->getRepository('DroneMapBundle:Drone')->find($id);

		if (!$entity) {
			throw $this->createNotFoundException('Unable to find Drone entity.');
		}

		// Activation du drone
		if(!$entity->getActivated()) {
			$entity->setActivated(true);
		}

		$em->flush();

		$editForm   = $this->createEditForm($entity);
		$deleteForm = $this->createDeleteForm($id);

		return $this->render('DroneMapBundle:Drone:manage.html.twig', array(
			'entity'      => $entity,
			'edit_form'   => $editForm->createView(),
			'delete_form' => $deleteForm->createView(),
		));
	}

	/**
	* Creates a form to edit a Drone entity.
	*
	* @param Drone $entity The entity
	*
	* @return \Symfony\Component\Form\Form The form
	*/
	private function createEditForm(Drone $entity) {
		$form = $this->createForm(new DroneType(), $entity, array(
			'action' => $this->generateUrl('drone_update', array('id' => $entity->getId())),
			'method' => 'PUT',
		));

		$form->add('submit', 'submit', array(
				'label' => 'Mettre à jour',
				'attr'  => array(
						'class' => 'btn btn-info'
					)
				));

		return $form;
	}

    /**
     * Edits an existing Drone entity.
     * @param Request $request
     * @param $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|Response
     */
	public function updateAction(Request $request, $id) {
		$em = $this->getDoctrine()->getManager();

		$entity = $em->getRepository('DroneMapBundle:Drone')->find($id);

		if (!$entity) {
			throw $this->createNotFoundException('Unable to find Drone entity.');
		}

		$deleteForm = $this->createDeleteForm($id);
		$editForm = $this->createEditForm($entity);
		$editForm->handleRequest($request);

		if ($editForm->isValid()) {
			$em->flush();

			return $this->redirect($this->generateUrl('drone_edit', array('id' => $id)));
		}

		return $this->render('DroneMapBundle:Drone:edit.html.twig', array(
			'entity'      => $entity,
			'edit_form'   => $editForm->createView(),
			'delete_form' => $deleteForm->createView(),
		));
	}

    /**
     * Deletes a Drone entity.
     * @param Request $request
     * @param $id
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
	public function deleteAction(Request $request, $id) {
		$form = $this->createDeleteForm($id);
		$form->handleRequest($request);

		if ($form->isValid()) {
			$em = $this->getDoctrine()->getManager();
			$entity = $em->getRepository('DroneMapBundle:Drone')->find($id);

			if (!$entity) {
				throw $this->createNotFoundException('Unable to find Drone entity.');
			}

			$em->remove($entity);
			$em->flush();
		}

		return $this->redirect($this->generateUrl('drone'));
	}

	/**
	 * Creates a form to delete a Drone entity by id.
	 *
	 * @param mixed $id The entity id
	 *
	 * @return \Symfony\Component\Form\Form The form
	 */
	private function createDeleteForm($id) {
		return $this->createFormBuilder()
			->setAction($this->generateUrl('drone_delete', array('id' => $id)))
			->setMethod('DELETE')
			->add('submit', 'submit', array(
				'label' => 'Supprimer',
				'attr'  => array(
						'class' => 'btn btn-danger'
					)
				))
			->getForm()
		;
	}
}
